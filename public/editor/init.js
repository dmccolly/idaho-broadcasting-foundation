window.CMS_MANUAL_INIT = true;
(function () {
  var cms = window.CMS || window.NetlifyCmsApp || window.NetlifyCms;
  if (cms) {
    cms.init({ config: '/editor/config.yml' });
  } else {
    console.error('Netlify CMS global not found.');
  }
})();
