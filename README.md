1, To start the services:
	`npm install`
	`docker-compose build`
	`docker-compose up`
**Note, make sure there are no conflicting ports active when running `up`

2, Test api
	Run `curl -F 'data=@time-report-42.csv' localhost:3000/csv` to upload 
	Run `curl localhost:3000/report` to see report

the port is 3000



How did you test that your implementation was correct?
	Most testing I've done are empirical
If this application was destined for a production environment, what would you add or change?
	I would add environment varible check to various area(verbosity, change db and redis url)
What compromises did you have to make as a result of the time constraints of this challenge?
	1, Error check
	2, Opitmalizing some code in report.js
	3, Handle edge cases