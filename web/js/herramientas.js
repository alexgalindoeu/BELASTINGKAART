// Registry of Belgian tools. A tool is exposed only when its implementation is enabled.
(() => {
  const registry=[
    {id:"gross-net",feature:"grossToNet",href:"#simulator",languages:["nl","fr"]},
    {id:"gross-scenarios",feature:"scenarios",href:"#scenarios",languages:["nl","fr"]},
    {id:"csv-export",feature:"csvExport",href:"#export",languages:["nl","fr"]},
    {id:"saved-reports",feature:"paidReports",href:"#reports",languages:["nl","fr"]}
  ];
  function available(config=window.BK_CONFIG){return registry.filter(x=>config?.features?.[x.feature]===true);}
  window.BKTools=Object.freeze({registry,available});
})();
