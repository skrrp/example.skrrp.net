# example.skrrp.net

A simple template to generate HTML sites with Apache2's server-side include engine.

Note this is NOT a static site generator, there are plenty of those elsewhere.

## Assets

### SVG 

The icons for changing theme are included in the MIT license and are free to use.

### Fonts 

The fonts included in the `font` directory are included under the Open Font License (read it here: https://openfontlicense.org/ )

You may use them, or replace them as you wish. They were both downloaded from https://fontesk.com/ , a great resource for free fonts. Make sure you use the web versions.

https://fontesk.com/oak-sans-typeface/

https://fontesk.com/pitagon-sans-mono-font/

A note on fonts - when testing the site with JavaScript disabled in Firefox (as you should) - I noticed that the custom fonts don't load at all even though they are pure CSS. I do not know if this is a bug or intended behaviour, but you should also test with JavaScript enabled to see the font you are using.

### Skrrp logo and favicon

These are included as examples. The images are Copyright skrrp.net 2023 as original works. You are likely to want to change them to reflect your own branding. Make sure to also include the `logo-dark.png` file if you are using the theme switcher.

## A note on external resources

You need to gain consent for any external resources that are loaded. The biggest culprit is Google fonts, but this applies to anything - including Font Awesome. It is always better if you host each resource you need on your own server and do not make external calls. Making external calls is illegal without consent in some jurisdictions.

## Getting started

In order to use this template you need an Apache2 server with the following modules enabled:

    sudo a2enmod include
    sudo a2enmod rewrite

Then restart your server:

    sudo systemctl restart apache2

A sample site config looks like:

    <VirtualHost *:80>
        ServerName example.skrrp.net
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/example.skrrp.net/
        <Directory /var/www/example.skrrp.net/>
                Options -Indexes +FollowSymLinks
                AllowOverride All
                Require all granted
        </Directory>
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
        <Directory "/">
                Options -Indexes
        </Directory>
        RewriteEngine on
        RewriteCond %{SERVER_NAME} =example.skrrp.net
        RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
    </VirtualHost>

Securing the site with SSL is left as an exercise to the reader. It is best to use Let's Encrypt - https://letsencrypt.org/

You should then clone the repo into a directory on your server and alter the config above to reflect where it is placed. Then enable the site with:

    a2ensite 000-example.skrrp.net.conf

then reload your configuration:

    service apache2 reload

If you get any errors on the reload you should investigate and fix. Good luck.

You should then replace the `img/site.ico`, `img/logo.png` and `img/logo-dark.png` files with your own branding. At this point, the example site should be running.

## How to use this template

The template tries its best to separate concerns - style, navigation and content. It's not a full CMS even if you squint and still requires manual effort to get it to hang together but it's simple and easy to create fast loading sites with simple HTML.

### Style

Style is probably the easiest. The `site.css` file is loaded first and should contain all of your static style elements. 

Anything that is related to theme needs to be clumsily added into the array in `js/css-picker.js`. I have not built a full theming engine sorry. While I have settled on 4 basic themes - a mix of hi- and low- contrast in light and dark - there is in theory no limit to how many you may have. Simply add to the `js` file to create new ones and make buttons for them.

Since the CSS is loaded first and the JavaScript applied afterwards you may put elements in both. In fact, it is best for the CSS to work for the entire site with JavaScript disabled.

### Content

Content is also easy. Each content page is a simple HTML page. You should put everything that goes inside a `body` tag in the file - that is start with a heading and end at the end of the content. Any and all HTML elements are available.

You can organise content as you wish, but I find it easier to create separate sub-directories in my site for each subject area and then an additional content directory in each. The base content directory in the example layout contains content to do with the site rather than subject matter - eg: the main index and the about page.

### Layout

This is the tricky one and is still a bit clunky.

I am aware that it is possible to read from the URL and dynamically load content. I have chosen not to go this route as it allows fishing expiditions and directory traversal attacks simply by modifying the URL. This means that each and every content page needs a layout page to mirror it.

This is the site's main `index.html`:

    <!--#set var="title" value="example.skrrp.net" -->
    <!--#set var="head" value="head.html" -->
    <!--#set var="menu" value="menu.html" -->
    <!--#set var="content" value="/content/index.html" -->
    <!--#include file="template.html" -->

These files are all very similar and are a pain to create, but they make the site work.

The first line sets the title of the page - the words that appear in the browser's title bar or on the tab.

The next defines the header file to use. This is likely to be the same each and every time, but it allows for swapping out of header files to include extra functionality on certain pages. 

The next defines the menu to use. Since this is the base `index.html` it uses the base menu. Pages within the subject areas of your site will probably use different menu files.

The next tells the page which content to load. This is an absolute path to the content file.

The final line tells the server to load the base template file and kick it all off.

#### The template

You shouldn't need to edit this much, or at all once you are happy with the layout. By default it has a top header bar to the page, then a 3-column layout. The left column is designed for the menu, the central big one for the page content and the right-hand column is for ... ads? Links to other sites? Anything you want. If you don't want to use the right column then you can remove it from the template file, or simply set it to 0% in the CSS.

    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title><!--#echo var="title" --></title>
        <!--#include virtual="$head" -->
      </head>
      <body>
        <div id="content-wrap">
          <div id="top">
            <div class="row">
              <div class="column"><!--#include virtual="/top.html" --></div>
              <div class="css-picker" id="css-picker"></div>
            </div>
            <hr>
          </div>
          <div class="row">
            <div class="column left"><!--#include virtual="$menu" --></div>
            <div class="column middle"><!--#include virtual="$content" --></div>
            <div class="column right"><!--#include virtual="/right.html" --></div>
          </div>
        </div>
        <footer id="footer"><!--#include virtual="/foot.html" --></footer>
        <script>setUpCss();</script>
        <script>addCssButtons();</script>
      </body>
    </html>

As you can see, this is a bare-bones HTML page, devoid of content ... well, anything really. It starts by setting the title, then loading the header file.

The top `div` holds the site banner content defined in `top.html`, then there is the section for the custom CSS loaded in by the theme picker buttons.

Then comes the 3-column layout, loading the menu as defined in the calling page, the content from the same, and then the right sidebar that comes from `right.html`.

It finishes up by loading a footer message from `foot.html`, then it tries to execute a couple of functions from the JavaScript. The first applies the CSS theme - if there is any currently set in the user cookie - then it sets up the buttons. The functionality with JavaScript disabled is that the site is always displayed in high-contrast light theme and the selector buttons are not displayed. Things could be worse.

Note that in the navigation HTML pages, the reference to the template is from _the navigation file_ file, but the reference to any content is from _the template_ (root directory).

#### head.html

This is the first part of the page and is delivered before any renderable content.

    <link rel="stylesheet" type="text/css" href="/site.css">
    <style id="swap-style">body:{background-color:#ffffff;color:#000000;}input{background-color:#ffffff;color:#000000;}a:link{color:#0066cc;}a:visited{color:#5518ab;}a:hover{color:#0066cc;}a:active{color:#ee0000;}a.no-href{all:unset;cursor:pointer;color:#000000;}.grey-box{background-color:#dcdcdc;padding:5px;}</style>
    <link rel="icon" type="image/x-icon" href="/img/site.ico">
    <script src="/js/css-picker.js"></script>
    <meta charset="utf-8">

As you can see, it loads the CSS, sets the 'default' theme, sets the site's favicon - the little icon in the browser tab - then loads the scripts and sets the character set. You can edit this as you need.

You may have multiple headers, where some pages need a lot more JavaScript to be loaded for example. It keeps the page load clean if you only load what you need.

#### top.html

This is the header bar of the page.

    <h1>
      <a class="no-href" href="https://example.skrrp.net">
        <img id="header-image" src="/img/logo.png" alt="Posternity logo">&nbsp;<span class="big">example.skrrp.net</span>
      </a>
    </h1>

It simply loads the site logo and name. You can replace the name with a full logo if you wish.

Despite being big the top scrolls with the page content, so screen real-estate is not lost despite the size.

#### right.html

A simple example of what might be here. The default template only provides marker text

#### foot.html

The site footer, to be displayed on all pages. It tries to keep it at the bottom - that is the bottom of the page with short content and below the content for long content. It does this with varying degrees of success.

#### menu.html

This is the left navigation bar and can become complex. I try to keep my base - in the root directory - menu short, then expand it when people get into content areas.

Here is the example root menu:

    <ul class="no-bullet">
      <li><a class="no-href" href="/index.html">example.skrrp.net</a></li>
      <li>
        <ul class="no-bullet">
          <li><a href="/index.html">Main page</a></li>
          <li><a href="/about.html">About site</a></li>
        </ul>
      </li>
      <br/>
      <li>Subjects</li>
      <li>
        <ul class="no-bullet">
          <li><a href="/subject-1/index.html">Subject 1</a></li>
          <li><a href="/subject-2/index.html">Subject 2</a></li>
        </ul>
      <li>
    </ul>

At the top it has links to information about the site itself - the root and the about page. Lower down it has links to the start of each subject section - the landing page of each subject sub-site.

Here is the menu from a subject:

    <ul class="no-bullet">
      <li>Subject 1</li>
      <li>
        <ul class="no-bullet">
          <li><a href="/subject-1/index.html">Index</a></li>
          <li><a href="/subject-1/page-001.html">Page 1</a></li>
          <li><a href="/subject-1/page-002.html">Page 2</a></li>
        </ul>
      </li>
    </ul>
    <!--#include virtual="../menu.html" -->

This contains links to all the content pages in this subject area at the top, then also includes the main menu below. This puts the navigation of the subject in a group as well as allowing quick navigation to other subject areas below.

## Further work

For a simple site this system is a bit clunky, but works well.

I am also working on a project that is a website and an EPUB book at the same time, with multiple authors. Obviously, the binary blob of an EPUB zip is terrible for git and collaboration, so the workflow is;

* Edit the EPUB locally
* Run a local script to unzip the EPUB into its contents
* Commit and push everything _but_ the EPUB file
* On the server, pull the repo
* Re-zip the contents of the EPUB into a book in the web directory
* Use some `sed` magic to convert the EPUB pages into content files for the template
* Run a PHP script to build the menu from the files available
* There is now a fresh downloadable e-book on the website, as well as its content in web pages

It's a tough workflow, but shows what can be done with simple templating and scripting.
