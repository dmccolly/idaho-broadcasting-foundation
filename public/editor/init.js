window.CMS_MANUAL_INIT = true;

(function () {
    var cms = window.CMS || window.DecapCmsApp || window.DecapCms;
    if (cms) {
          cms.init({ config: '/editor/config.yml' });
    } else {
          console.error('Decap CMS global not found.');
    }
})();
