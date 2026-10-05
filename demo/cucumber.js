/** Cucumber-JS profile for demo/ (Lesson 15 parity).
 * Gives `npx cucumber-js` AND the VS Code Cucumber extension a deterministic
 * glue path so `Given user is on login page` resolves to
 * features/steps/login.steps.ts instead of reporting "Undefined step".
 * Java side (Eclipse/IntelliJ) is untouched: glue stays com.cp.Steps + com.cp.Hooks.
 */
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['features/steps/**/*.ts'],
    format: ['pretty', 'html:cucumber-report.html'],
    publishQuiet: true
  }
};
