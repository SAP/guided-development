# Contributing Guidelines

## Report an Issue

To report an issue please use the github issue tracker. Please try to make sure you have these in your issue:
* No duplicate
* Reproducible
* Good summary
* Well-documented
* Minimal example

## Issue handling process
When an issue is reported, a committer will look at it and either confirm it as a real issue (by giving the "in progress" label), close it if it is not an issue, or ask for more details. In-progress issues are then either assigned to a committer in GitHub, reported in our internal issue handling system, or left open as "contribution welcome" for easy or not urgent fixes.

An issue that is about a real bug is closed as soon as the fix is committed.

## Contribute Code
You are welcome to contribute code. PRs will be examined and if it fits the quality requirements and the roadmap of the product they will be merged.

## Commit Messages
This project uses [conventional commits standard](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#specification) with the [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional).
Recommanded: Use `git cz` to build conventional commit messages.
- requires [commitizen](https://github.com/commitizen/cz-cli#installing-the-command-line-tool) to be installed.

## Developer Certificate of Origin (DCO)
Due to legal reasons, contributors will be asked to accept a DCO before they submit the first pull request to this projects, this happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## Contributing with AI-generated code

As artificial intelligence evolves, AI-generated code is becoming valuable for many software projects, including open-source initiatives. While we recognize the potential benefits of incorporating AI-generated content into our open-source projects there a certain requirements that need to be reflected and adhered to when making contributions.

Please see our [guideline for AI-generated code contributions to SAP Open Source Software Projects](https://github.com/SAP/.github/blob/main/CONTRIBUTING_USING_GENAI.md) for these requirements.

## Release Process

Releases are triggered by pushing a version tag. Only maintainers with push access to the repository can do this.

### Steps to release

1. Bump the version in `backend/package.json` and `guided-development-types/package.json` and commit to `master`.
2. Push a version tag:
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```
3. The [Release workflow](https://github.com/SAP/guided-development/actions/workflows/release.yml) starts automatically. You can follow its progress in the **Actions** tab.
4. Once complete:
   - A new [GitHub Release](https://github.com/SAP/guided-development/releases) is created with the `.vsix` file attached and auto-generated release notes.
   - The `guided-development-types` package is published to [npmjs.com](https://www.npmjs.com/package/@sap_oss/guided-development-types).

### One-time setup (first release from a new environment)

Before publishing to npm works, a maintainer must register this repository as a Trusted Publisher on npmjs.com — this only needs to be done once:

1. Go to the `@sap_oss/guided-development-types` package page on npmjs.com → **Settings** → **Automated Publishing**.
2. Click **Add a Publisher**, select **GitHub Actions**, and fill in:
   - **Owner**: `SAP`
   - **Repository**: `guided-development`
   - **Workflow filename**: `release.yml`
3. Save. No npm token or secret needs to be added to the GitHub repository.
