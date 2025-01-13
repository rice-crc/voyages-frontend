# Voyages3 Frontend Deployment Notes

The Voyages3 API project is based on a microservices model. This (React) frontend application communicates with a (Django) backend API to request data and then present the responses.

The deployment process is relatively straightforward, though there are two open questions as of January 13 that could change the below instructions in two ways. We will outline these at the end of this brief document.

## Node version

This project was built with node 16. If you are using NVM to manage your node environment, you should start by running ```nvm use 16.15.1```.

## Packages

Next, you'll want to blow away your existing node packages and then install package.json:

	rm -rf package-lock.json node_modules
	npm i

Finally, you'll need to force install one package (mirador), which raises flags with other packages but does in fact work. You will also want to use the no-save flag in order to ensure package.json is not affected: ```npm i --force mirador@"^3.3.0 --no-save```

## Environment settings

Following the structure of the sample file provided at ```dotenv-sample.txt```, a ```.env``` file should be created in the root directory with a valid API token.

## 2 open questions

We have two outstanding issues to resolve before deployment. Both could be considered nice-to-have. One will simplify things greatly, the other will complicate them.

### Node

The first open question has to do with node and the mirador package. We should test whether we can upgrade our node version given that we have not done so since December 2023; and we should test whether the mirador issue still requires a two-step installation with the ```--force``` option.

Note: I (JCM) have attempted rebuilding the project on my local using  node 20.14.0. It appears to work, and it looks like mirador 4 plays nicely with the other packages. This should be tested by Thasanee (and some warnings should be addressed).

### Proxy server

The second open question has to do with whether we can use our frontend server as a pass-through. I would prefer to not expose our api key to users, even if it is read-only, which is our current practice. I would rather have client requests go to the frontend (which will live at www.slavevoyages.org) and thence to the backend (which will live somewhere like api.slavevoyages.org or voyages-api.org) with the key attached. This question should be run by Derek, Thasanee, and Domingos before proceeding.