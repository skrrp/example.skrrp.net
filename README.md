# example.skrrp.net

A simple template to generate HTML sites with Apache2's server-side include engine.

Note this is NOT a static site generator, there are plenty of those elsewhere.

## Assets

### SVG 

The icons for changing theme are included in the bundle and are free to use.

### Fonts 

The fonts included in the `font` directory are included under the Open Font License (read it here: https://openfontlicense.org/ )

You may use them, or replace them as you wish. They were both downloaded from https://fontesk.com/ , a great resource for free fonts. Make sure you use the web versions.

https://fontesk.com/oak-sans-typeface/

https://fontesk.com/pitagon-sans-mono-font/

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
        DocumentRoot var/www/example.skrrp.net/
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

You should then replace the `img/site.ico`, `img/logo.png` and `logo-dark.png` files with your own branding. At this point, the example site should be running.

## Template layout
