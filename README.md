1, To start the services:
	`docker-compose build`
	`docker-compose up`
**Note, make sure there are no conflicting ports active when running `up`

2, Test api
	Run `curl -F 'data=@time-report-42.csv' localhost:3000/csv` to upload 
	Run `curl localhost:3000/report` to see report

the port is 3000
