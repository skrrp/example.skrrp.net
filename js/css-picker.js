function setUpCss() {
  changeCss(
    document.cookie.split("; ").find((row) => row.startsWith('site-theme='))?.split("=")[1]
  );
}

function getCss(type) {
  const css = {
    'light-hi': function() { return 'body:{background-color:#ffffff;color:#000000;}input{background-color:#ffffff;color:#000000;}a:link{color:#0066cc;}a:visited{color:#5518ab;}a:hover{color:#0066cc;}a:active{color:#ee0000;}a.no-href{all:unset;cursor:pointer;color:#000000;}.grey-box{background-color:#dcdcdc;padding:1px;}'; },
    'light-lo': function() { return 'body{background-color:#eeeeee;color:#333333;}input{background-color:#eeeeee;color:#333333;}a:link{color:#0055bb;}a:visited{color:#44089a;}a:hover{color:#0055bb;}a:active{color: #dd0000;}a.no-href{all:unset;cursor:pointer;color:#333333;}.grey-box{background-color:#bababa;padding:1px;}'; },
    'dark-lo': function() { return 'body{background-color:#333333;color:#dddddd;}input{background-color:#333333;color:#dddddd;}a:link{color:#ffaa44;}a:visited{color:#bbf675;}a:hover{color:#ffaa44;}a:active{color:#220000;}a.no-href{all:unset;cursor:pointer;color:#dddddd;}.grey-box{background-color:#242424;padding:1px;}'; },
    'dark-hi': function() { return 'body{background-color:#000000;color:#ffffff;}input{background-color:#000000;color:#ffffff;}a:link{color:#ff7744;}a:visited{color:#ccf275;}a:hover{color:#ff7744;}a:active{color:#22ffff;}a.no-href{all:unset;cursor:pointer;color:#ffffff;}.grey-box{background-color:#121212;padding:1px;}'; },
  };
  if (!type in css) type = 'light-hi';
  return css[type]();
}

function getImage(type) {
  const img = {
    'light-hi': function() { return '/img/logo.png'; },
    'light-lo': function() { return '/img/logo.png'; },
    'dark-lo': function() { return '/img/logo-dark.png'; },
    'dark-hi': function() { return '/img/logo-dark.png'; },
  };
  if (!type in img) type = 'light-hi';
  return img[type]();
}

function changeCss(type) {
  styleElement = document.getElementById('swap-style');
  if (styleElement != null) {
    styleElement.innerHTML = getCss(type);
  }
  
  imgElement = document.getElementById('header-image');
  if (imgElement != null) {
	imgElement.src = getImage(type);
  }
  
  const date = new Date(new Date().setFullYear(new Date().getFullYear() + 10));
  document.cookie = "site-theme="+type+"; expires="+date.toUTCString()+"; max; path=/;";
}

function addCssButtons() {
  cssPicker = document.getElementById('css-picker');
  if (cssPicker == null) {
    return;
  }
  cssPicker.innerHTML = `
<div class="css-picker-content">
<button onclick="changeCss('light-hi')"><img class="style-image-button" src="/img/light-hi.svg" alt="High contrast light theme"></button>
<button onclick="changeCss('light-lo')"><img class="style-image-button" src="/img/light-lo.svg" alt="Low contrast light theme"></button><br>
<button onclick="changeCss('dark-lo')"><img class="style-image-button" src="/img/dark-lo.svg" alt="Low contrast dark theme"></button>
<button onclick="changeCss('dark-hi')"><img class="style-image-button" src="/img/dark-hi.svg" alt="High contrast dark theme"></button>
</div>
`;
}
