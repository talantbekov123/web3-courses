Task 2: Crowdfunding with Voting & HelloWorld Function

Refactor your crowdfunding contract to include a HelloWorld function.

The HelloWorld function can be enabled or disabled based on votes from contributors.

Each address that contributed has one vote, regardless of how many times they funded or how much they contributed.

Each contributor can vote to disable or enable the HelloWorld function.

Votes can be changed (from true to false or vice versa), but each address can vote only once at a time.

Include functions to cast votes and tally votes to determine whether HelloWorld is active.

Suggested function names:

helloWorld() – prints a message if enabled.

voteToDisable(bool vote) – cast or update your vote.

getVote(address voter) – check an address’s vote.

tallyVotes() – calculate current votes and determine HelloWorld status.

VotingUpdated(address voter, bool vote) – event emitted when someone votes.

Concepts to practice: payable, events, mappings/structs for voting, conditional function execution.