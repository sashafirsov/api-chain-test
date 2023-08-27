// import { playwrightLauncher } from '@web/test-runner-playwright';
import { chromeLauncher } from '@web/test-runner';

const filteredLogs = ['Running in dev mode', 'lit-html is in dev mode','Lit is in dev mode.'];

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files:[   'test/*.test.js'
        ,'out-tsc/**/*.test.js'
        // ,   'src/slots-light-vs-shadow.html'
        ],

  preserveSymlinks:true,

  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto',

  /** Amount of browsers to run concurrently */
  // concurrentBrowsers: 2,

  /** Amount of test files per browser to test concurrently */
  // concurrency: 1,

  /** Browsers to run tests on */
  // browsers: [
  //   playwrightLauncher({ product: 'chromium' }),
  //   playwrightLauncher({ product: 'firefox' }),
  //   playwrightLauncher({ product: 'webkit' }),
  // ],
  browsers: [chromeLauncher({ launchOptions: { args: ['--no-sandbox', '--start-maximized'] } })],

  // See documentation for all available options

});
