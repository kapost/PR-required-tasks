const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  const name = 'PR Required Tasks';

  try {
    const token = core.getInput('token', { required: true });
    const body = core.getInput('body', { required: true });

    const incompleteTasks = body.includes("- [ ] <!-- required task -->")

    const githubApi = new github.GitHub(token)

    await githubApi.checks.create({
      name,
      head_sha: github.context.payload.pull_request?.head.sha,
      status: 'completed',
      conclusion: incompleteTasks ? 'failure' : 'success',
      completed_at: new Date().toISOString(),
      output: {
        title: name,
        summary: incompleteTasks ? 'Some required tasks are incomplete ❌' : 'All required tasks complete ✅',
      },
      owner: github.context.repo.owner,
      repo: github.context.repo.repo
    })

  } catch (error) {
    core.setFailed(error.message);
  }
}

main();