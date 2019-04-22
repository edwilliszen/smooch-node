# Project Smooch-Zendesk-Connect -> node conversion
A quick port of the original project in Python to Node

## Owners

| Ref      | Link                                                                          |
| :------- | :---------------------------------------------------------------------------- |
| Original | https://github.com/smooch/smooch-zendesk-connect/tree/smoochConnect-public-RC |

## Pre-Requisites
1. Node v8 or above: https://nodejs.org/en/download/
2. Serverless: `npm install -g serverless`
3. AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
4. Authorised/configured AWS IAM user (e.g.:)
    * keyId/secret under [serverless] in ~/.aws/credentials, or
    * `serverless config credentials --provider aws --key xxxxxxxxxxx --secret xxxxxxxxxxx`
5. Clone repo `git clone https://github.com/edwilliszen/smooch-node.git`
6. In repo directory run `npm install` 
7. Take a look at package.json for list of short cut commands that can be used via npm run, ex `npm run deploy` or `run npm testl`
8. Check original repo for more info - https://github.com/smooch/smooch-zendesk-connect/tree/smoochConnect-public-RC

## Push environment variables to AWS (SSM)
Use the command `aws ssm put-parameter --name supermanToken --type String --value mySupermanToken`
### Required keys
* appId
* integrationId
* smoochJWT

## Deploy solution (only needed initially or if serverless.yml changes)
* Serverless command: `serverless deploy -r us-west-2 -v --aws-s3-accelerate`
* Npm Shortcut: `npm run deploy` (has defaults built in)

## Deploy just the Lambda function
* Serverless command: `serverless deploy -r us-west-2 -v -f connectNotification`
* Npm Shortcut: `npm run deployf` (has defaults built in)

## Testing remotely and locally
Remotely (requires a deploy of the function between changes):
* Serverless command: `serverless invoke -f connectNotification -p payload.json` Runs function remotely and uses payload.json file to simulate input
* Npm Shortcut: `npm run test` (has defaults built in)

Locally (very useful for testing changes, fast and quick doesn't require a deploy):
* Serverless command: `serverless invoke local -f connectNotification -p payload.json` Runs function remotely and uses payload.json file to simulate imput
* Npm Shortcut: `npm run testl` (has defaults built in)

## Monitoring logs with Serverless
`serverless logs -f connect -t`
* `-f` specifies the Serverless function name
* `-t` to display/update logs in [near] real-time
* Shortcut: `npm run logs`

## PostMan
smooch.postman_collection.json has a simple post setup to test the API end point.  You will need to rerplace the endpoint with your actual endpoint