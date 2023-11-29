# Playwright/Typescript starter

This is a Playwright/TypeScript starter kit that I use for my parsers.
Quickly jump to [Dependencies](#Dependencies) to see what's included.
- **NO ESM SUPPORT** - some utility dependencies are intentionally downgraded because of this.

<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Playwright/Typescript starter](#playwrighttypescript-starter)
  - [Getting started](#getting-started)
  - [Included code samples](#included-code-samples)
    - [./src/index.ts](#srcindexts)
    - [./src/libs.ts](#srclibsts)
  - [Side notes](#side-notes)
    - [APIRequest vs page.evaluate/goto/etc..](#apirequest-vs-pageevaluategotoetc)
    - [Windows support](#windows-support)
    - [Free proxies](#free-proxies)
  - [Dependencies](#dependencies)
    - [Basic](#basic)
    - [Parsing](#parsing)
    - [Utilities](#utilities)
  - [To-do's](#to-dos)
  - [Contributing](#contributing)

<!-- TOC end -->

## Getting started

    git clone https://github.com/nonme/TypescriptStarter
    npm install
    npx playwright install
    npm start

You can safely remove everything in ./src/ to get started.

## Included code samples

### ./src/index.ts

Contains an small example of a very basic workflow:

- Initiate a Chromium instance with the stealth library, which tries to make the browser undetectable for protected websites.
- Create a browser page and navigate to https://whatismyipaddress.com
- Parse the response with Cheerio, extracting the IP address and printing it.

### ./src/libs.ts

Contains basic examples of using all utility dependencies - see [Utilities](###utilities).

## Side notes

### APIRequest vs page.evaluate/goto/etc..

It's usually better to use [APIRequest](https://playwright.dev/docs/api/class-apirequestcontext) (for example, in step 2 of the Code Sample section) whenever possible since it's much faster and consumes fewer resources than using the actual browser instance. You would want to use the Playwright browser instance for websites that contain JavaScript protection, meaning that the HTML in the page's response is encoded in some way and requires JS on the client side to decode it.

### Windows support

If this doesn't work on Windows, remove node-cron and ps-list from dependencies. Look for a restarting solution for Windows by yourself (however, I advise you to use WSL, which is what I do).

### Free proxies

Many websites will block you if you use the same IP address to access them in your parser. I suggest you use the awesome [Snawoot's clients](https://github.com/Snawoot/opera-proxy) if you need free proxies. Note: check out his other clients, besides the linked opera-proxy.

## Dependencies

### Basic

- **"@types/node": "^20.10.0"**,

- **"@typescript-eslint/eslint-plugin": "^6.9.1"**,

- **"@typescript-eslint/parser": "^6.9.1"**,

- **"eslint": "^8.52.0"**,

- **"prettier": "3.0.3"**,

- **"ts-node": "^10.9.1"**,

- **"tslib": "^2.6.2"**,

- **"typescript": "^5.2.2"**

### Parsing

- **"cheerio": "1.0.0-rc.12"** - HTML parser. **Must always be used whenever possible** since it's much faster than Playwright's findText etc. However, it can't work with JS-protected HTML pages.

- **"playwright": "^1.39.0"** - Replace with Puppeteer if needed.

- **"playwright-extra": "^4.3.6"** - Required for the plugin below.

- **"puppeteer-extra-plugin-stealth"**: "^2.11.2" - A plugin that tries to make your headless browser undetectable by websites, so you are less likely to get blocked.

### Utilities

- **"dotenv"**: "^16.3.1" - A library for using your .env variables in code.

- **"mysql2": "^3.6.5"** - MySQL driver. Remove if you don't use MySQL.

- **"node-cron": "^3.0.3"** - Library for restarting your parser if it goes down for some reason. Native cron jobs can also be used (I use them both situationally).

- **"p-limit": "2.3.0"** - Library for limiting the number of concurrent operations. Very useful if you need to parse pages concurrently, but need to adjust it to match your system resources.

- **"ps-list": "^7.2.0"** - Library to use in conjunction with node-cron, allows you to get process names so you can see if your parser's process is running - and restart it if not.

## To-do's

- Add ORM support
- Virtual screen for headful browsing on VPS (see [xvfb](https://www.npmjs.com/package/xvfb)). Be careful, as every xvfb.startSync() starts a new instance without closing the previous one, so you might accidentally spawn them until they consume all of your resources.
- Excel driver library (I am probably going to write my custom one)
- 2captcha library
## Contributing

Feel free to open an issue with your suggestions on adding/removing/replacing something. Your improvements/code samples are also very welcome.
