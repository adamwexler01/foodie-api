pipeline {
    agent any
    stages {
        stage('build') { 
            steps {
		echo 'building...'
                sh 'npm install'
		sh 'node yelp_restaurant_finder.js'
            }
        }

	stage('test'){
	    steps {
		echo 'testing...'
	    }
	}

	stage('deploy'){
	    steps {
		echo 'deploying...'
	    }
	}
    }
}