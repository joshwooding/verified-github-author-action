const github = require("@actions/github");
const core = require("@actions/core");


// most @actions toolkit packages have async methods
async function run() {
  try {
    const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN");
    const octokit = github.getOctokit(GITHUB_TOKEN);
    if (github.context.eventName === "pull_request") {
      const payload = github.context.payload;

      const pull_number = payload.pull_request.number;
      const owner = github.context.repo.owner;
      const repo = github.context.repo.repo;

      const { data: commits } = await octokit.rest.pulls.listCommits({ owner, repo, pull_number  });

      core.debug(commits);

      const containsBadAuthor = commits.some(commit => commit.author === null);

      if(containsBadAuthor){
        core.setFailed("Pull Request contains bad author");
      }

      core.info("No bad commits found")
    } else {
      core.setFailed(`Action needs to be run on the "pull_request" event but was run on "${github.context.eventName}" instead`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
