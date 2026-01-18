<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/rss">
        <html>
            <head>
                <title><xsl:value-of select="channel/title"/> - RSS Feed</title>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="crossorigin"/>
                <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&amp;family=Space+Grotesk:wght@400;700&amp;display=swap" rel="stylesheet"/>
                <style>
                    * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    }

                    body {
                    font-family: 'IBM Plex Mono', monospace;
                    line-height: 1.6;
                    color: #252525;
                    background: #fafafa;
                    padding: 2rem 1rem;
                    font-size: 16px;
                    }

                    .container {
                    max-width: 800px;
                    margin: 0 auto;
                    }

                    .header {
                    border-bottom: 2px solid #252525;
                    padding-bottom: 2rem;
                    margin-bottom: 2rem;
                    }

                    .header h1 {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 2rem;
                    font-weight: 700;
                    letter-spacing: 0.03em;
                    margin-bottom: 0.5rem;
                    color: #252525;
                    }

                    .header p {
                    color: #6b6b6b;
                    margin-bottom: 1rem;
                    }

                    .info {
                    background: #252525;
                    color: #fafafa;
                    padding: 1rem;
                    border-radius: 4px;
                    margin-top: 1rem;
                    font-size: 0.9rem;
                    }

                    .content {
                    padding: 0;
                    }

                    .item {
                    padding: 1.5rem 0;
                    border-bottom: 1px solid #e0e0e0;
                    }

                    .item:last-child {
                    border-bottom: none;
                    }

                    .item h2 {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                    letter-spacing: 0.03em;
                    margin-bottom: 0.5rem;
                    }

                    .item h2 a {
                    color: #252525;
                    text-decoration: none;
                    border-bottom: 1px solid rgba(125, 125, 125, 0.3);
                    transition: border 0.3s ease-in-out;
                    padding-bottom: 2px;
                    }

                    .item h2 a:hover {
                    border-bottom: 1px solid #252525;
                    }

                    .item .meta {
                    color: #6b6b6b;
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                    }

                    .item .description {
                    color: #252525;
                    line-height: 1.7;
                    }

                    @media (max-width: 768px) {
                    body {
                    padding: 1rem 0.5rem;
                    }

                    .header {
                    padding-bottom: 1.5rem;
                    }

                    .header h1 {
                    font-size: 1.5rem;
                    }

                    .item h2 {
                    font-size: 1.25rem;
                    }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1><xsl:value-of select="channel/title"/></h1>
                        <p><xsl:value-of select="channel/description"/></p>
                        <div class="info">
                            📰 Ceci est un flux RSS. Abonnez vous en copiant-collant l'URL dans votre lecteur RSS.
                        </div>
                    </div>

                    <div class="content">
                        <xsl:for-each select="channel/item">
                            <div class="item">
                                <h2>
                                    <a>
                                        <xsl:attribute name="href">
                                            <xsl:value-of select="link"/>
                                        </xsl:attribute>
                                        <xsl:value-of select="title"/>
                                    </a>
                                </h2>
                                <div class="meta">
                                    📅 <xsl:value-of select="substring(pubDate, 0, 17)"/>
                                </div>
                                <div class="description">
                                    <xsl:value-of select="description"/>
                                </div>
                            </div>
                        </xsl:for-each>
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>