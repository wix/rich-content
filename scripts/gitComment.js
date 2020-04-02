const github = require('@actions/github');

module.exports = async function(message) {
  const { REPO_TOKEN } = process.env;
  const request = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number,
  };
  request.body = message;
  const client = new github.GitHub(REPO_TOKEN);
  await client.pulls.update(request);
};
