(function () {

  var PALETTE = {
    mdm2:     '#4a6fa5',   // target protein
    vhl:      '#8e6bb0',   // E3 ligase
    elongin:  '#c3c7d4',   // ElonginB / ElonginC (muted)
    warhead:  '#e08a3c',   // MDM2-binding segment of the PROTAC
    linker:   '#e8c547',   // GS linker
    recruiter:'#3f9e6d',   // VHL-binding segment
    peptide:  '#e08a3c',   // bound peptide in the binary viewers
    surface:  '#dfe4ee'
  };

  function styleBinary(viewer, cfg, opts) {
    var C = cfg.chains;
    // receptor
    viewer.setStyle({ chain: C.receptor },
      { cartoon: { color: PALETTE.mdm2, opacity: 0.95 } });
    // bound peptide: cartoon + sticks so side chains are visible in the groove
    viewer.setStyle({ chain: C.peptide },
      { cartoon: { color: PALETTE.peptide },
        stick:   { colorscheme: 'default', radius: 0.14 } });

    if (opts.surface) {
      viewer.addSurface('$3Dmol.SurfaceType.VDW'in window ? window.$3Dmol.SurfaceType.VDW : 1,
        { opacity: 0.55, color: PALETTE.surface },
        { chain: C.receptor });
    }
  }

  /* receptor + a single explicit ligand (e.g. VHL with the pHIF1 recruiter,
     which Boltz-2 represents as one LIG residue so that Hyp and Hle survive) */
  function styleLigand(viewer, cfg, opts) {
    var C = cfg.chains;

    viewer.setStyle({ chain: C.receptor },
      { cartoon: { color: PALETTE.vhl, opacity: 0.92 } });

    viewer.setStyle({ chain: C.ligand },
      { stick: { colorscheme: 'yellowCarbon', radius: 0.20 } });

    // residues that form the hydroxyproline-recognition pocket
    if (opts.pocket && cfg.pocket) {
      viewer.addStyle(
        { chain: C.receptor, resi: cfg.pocket },
        { stick: { colorscheme: 'cyanCarbon', radius: 0.13 } });
    }

    // dashed lines for the key hydrogen bonds
    if (opts.hbonds && cfg.contacts) {
      var model = viewer.getModel();
      cfg.contacts.forEach(function (c) {
        var a = model.selectedAtoms({ chain: C.ligand,   atom: c.ligAtom })[0];
        var b = model.selectedAtoms({ chain: C.receptor, resi: c.resi, atom: c.atom })[0];
        if (!a || !b) return;
        viewer.addLine({
          start: { x: a.x, y: a.y, z: a.z },
          end:   { x: b.x, y: b.y, z: b.z },
          dashed: true, color: '#c0392b', linewidth: 2
        });
        if (c.label) {
          viewer.addLabel(c.label, {
            position: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 },
            fontSize: 10, fontColor: '#c0392b',
            backgroundColor: 'white', backgroundOpacity: 0.75,
            borderThickness: 0
          });
        }
      });
    }

    if (opts.surface) {
      viewer.addSurface(window.$3Dmol.SurfaceType.VDW,
        { opacity: 0.5, color: PALETTE.surface },
        { chain: C.receptor });
    }
  }

  function styleTernary(viewer, cfg, opts) {
    var C = cfg.chains, S = cfg.segments;

    viewer.setStyle({ chain: C.mdm2 }, { cartoon: { color: PALETTE.mdm2 } });
    viewer.setStyle({ chain: C.vhl },  { cartoon: { color: PALETTE.vhl } });

    if (opts.elongin) {
      viewer.setStyle({ chain: C.elonginB }, { cartoon: { color: PALETTE.elongin, opacity: 0.75 } });
      viewer.setStyle({ chain: C.elonginC }, { cartoon: { color: PALETTE.elongin, opacity: 0.75 } });
    } else {
      viewer.setStyle({ chain: C.elonginB }, {});
      viewer.setStyle({ chain: C.elonginC }, {});
    }

    // the PROTAC, drawn segment by segment so orientation is legible.
    // sticks (not cartoon) so the non-canonical Hyp HETATM renders too.
    viewer.setStyle(
      { chain: C.protac, resi: S.warhead },
      { stick: { color: PALETTE.warhead, radius: 0.20 } });
    viewer.setStyle(
      { chain: C.protac, resi: S.linker },
      { stick: { color: PALETTE.linker, radius: 0.18 } });
    viewer.setStyle(
      { chain: C.protac, resi: S.recruiter },
      { stick: { color: PALETTE.recruiter, radius: 0.20 } });
  }

  function initViewer(root) {
    var cfgEl = root.querySelector('script[type="application/json"]');
    if (!cfgEl) return;

    var cfg;
    try { cfg = JSON.parse(cfgEl.textContent); }
    catch (e) { root.classList.add('is-fallback'); return; }

    // no 3Dmol → show the static image instead
    if (typeof window.$3Dmol === 'undefined') {
      root.classList.add('is-fallback');
      return;
    }

    var stage   = root.querySelector('.sv-stage');
    var loading = root.querySelector('.sv-loading');
    var tabs    = Array.prototype.slice.call(root.querySelectorAll('.sv-tab'));
    var surfBox = root.querySelector('[data-toggle="surface"]');
    var eloBox  = root.querySelector('[data-toggle="elongin"]');
    var pockBox = root.querySelector('[data-toggle="pocket"]');
    var hbBox   = root.querySelector('[data-toggle="hbonds"]');
    var resetBtn= root.querySelector('[data-action="reset"]');
    var caption = root.querySelector('.sv-caption');

    var viewer = window.$3Dmol.createViewer(stage, {
      backgroundColor: 'white',
      antialias: true
    });

    var current = 0;
    var opts = {
      surface: surfBox ? surfBox.checked : false,
      elongin: eloBox  ? eloBox.checked  : true,
      pocket:  pockBox ? pockBox.checked : true,
      hbonds:  hbBox   ? hbBox.checked   : true
    };

    function applyStyle(entry) {
      viewer.removeAllSurfaces();
      viewer.removeAllLabels();
      viewer.removeAllShapes();
      viewer.setStyle({}, {});
      if (cfg.mode === 'ternary')     styleTernary(viewer, entry, opts);
      else if (cfg.mode === 'ligand') styleLigand(viewer, entry, opts);
      else                            styleBinary(viewer, entry, opts);
      viewer.render();
    }

    function load(i, keepView) {
      current = i;
      var entry = cfg.structures[i];

      tabs.forEach(function (t, k) { t.classList.toggle('is-active', k === i); });
      if (caption && entry.caption) caption.innerHTML = entry.caption;
      if (loading) loading.classList.remove('is-hidden');

      window.$3Dmol.download; // no-op guard for older builds
      fetch(entry.file)
        .then(function (r) {
          if (!r.ok) throw new Error('not found');
          return r.text();
        })
        .then(function (data) {
          viewer.clear();
          viewer.addModel(data, 'pdb');
          applyStyle(entry);
          if (!keepView) {
            var focus = cfg.mode === 'ternary' ? { chain: entry.chains.protac }
                      : cfg.mode === 'ligand'  ? { chain: entry.chains.ligand }
                      :                          { chain: entry.chains.peptide };
            viewer.zoomTo(focus);
          }
          viewer.zoom(cfg.mode === 'ternary' ? 0.55
                    : cfg.mode === 'ligand'  ? 0.45
                    :                          0.75);
          viewer.render();
          if (loading) loading.classList.add('is-hidden');
        })
        .catch(function () {
          root.classList.add('is-fallback');
        });
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { load(i); });
    });

    if (surfBox) surfBox.addEventListener('change', function () {
      opts.surface = surfBox.checked;
      applyStyle(cfg.structures[current]);
    });

    if (eloBox) eloBox.addEventListener('change', function () {
      opts.elongin = eloBox.checked;
      applyStyle(cfg.structures[current]);
    });

    if (pockBox) pockBox.addEventListener('change', function () {
      opts.pocket = pockBox.checked;
      applyStyle(cfg.structures[current]);
    });

    if (hbBox) hbBox.addEventListener('change', function () {
      opts.hbonds = hbBox.checked;
      applyStyle(cfg.structures[current]);
    });

    if (resetBtn) resetBtn.addEventListener('click', function () {
      load(current);
    });

    load(0);

    // keep the canvas sized correctly when the layout changes
    window.addEventListener('resize', function () { viewer.resize(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('.sv'), initViewer);
  });

})();
