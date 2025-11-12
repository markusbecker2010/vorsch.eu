window.addEventListener('load', function () {

    if(typeof window.location.hash === 'undefined' || window.location.hash.length < 2)
    {
        document.title = 'Vorsch.eu';
        document.getElementById('form').style.display = 'block';
        document.getElementById('laden').style.display = 'none';
        return;
    }
    
    try{
        start(LZString.decompressFromEncodedURIComponent(window.location.hash.slice(1)), true);
    } catch(e) {
        console.log('# Fehlt');
        document.title = 'Vorsch.eu';
        document.getElementById('form').style.display = 'block';
        document.getElementById('laden').style.display = 'none';
    }
});

function start(htmlsource, weiter) {

    if(htmlsource.length < 1) {
        return false;
    }

    const result = extractAndRemoveScripts(htmlsource);
    document.body.innerHTML = result.cleaned;
    
    if(result.scripts.length < 1) {
        return false;
    }
    
    let script = '';
    result.scripts.forEach(($script)=> {
        script += $script;
    });

    const s = document.createElement('script');
    s.textContent = script;
    s.setAttribute('type', 'text/javascript');
    document.body.appendChild(s);

    if(weiter === true) {
        return false;
    }

    try {
        location.hash = LZString.compressToEncodedURIComponent(htmlsource);
    } catch(e) {
        console.log('Source zu groß');
    }
}

function extractAndRemoveScripts(input) {
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  const matches = [];
  // extrahieren
  input.replace(scriptRegex, (full, inner) => {
    matches.push(inner);
    return full;
  });
  // skripte entfernen
  const cleaned = input.replace(scriptRegex, '');
  return { scripts: matches, cleaned };
}