# Security and Meal Matchup

Security is immensely important for any web application. This document outlines the general guidelines contributors should follow when working on Meal Matchup.

## Dependabot warnings

Occasionally, security bugs will be found in project dependencies and the automated Dependabot will find them. In this scenario, it's likely that Dependabot will create an automatic pull request fixing the issue with a newer version of the dependency. **However**, this may not be the best way forward.

For example, we recevied a Dependabot warning for an outdated version of `lodash`. But if you check `package.json`, you will not find `lodash` listed anywhere – this is because it is a dependency of a dependency. In that case, it's better to see if the dependencies we use that in turn use `lodash` need updating. So, it's better to run `npm audit` as well as check `npm outdated` and then run `npm update` to see if updating things fix the vulnerability. Then you can push or PR the change and the Dependabot warning will go away.

## Environment variables

Keeping environment variables secure is highly important for ensuring the security of Meal Matchup. That is why we use `.env` files to hide them from our repository. **Do not write environment variables in any file that will be uploaded to GitHub.**
