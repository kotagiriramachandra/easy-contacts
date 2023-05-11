pipeline {
	agent any
  tools {
    nodejs 'NODEJS'
  }
	parameters{
		string defaultValue: 'develop', description: 'Source Branch', name: 'BRANCH_NM'
	}
	stages {
		stage ('build') {
			steps {
				echo " Before build for branch: ${params.BRANCH_NM}"
        checkout scmGit(branches: [[name: "*/${params.BRANCH_NM}"]], extensions: [], userRemoteConfigs: [[credentialsId: 'git-cred', name: 'origin', url: 'https://github.com/kotagiriramachandra/easy-contacts.git']])
				bat 'npm install -g win-node-env'
				bat 'npm run build'        
        echo " After build for branch: ${params.BRANCH_NM}"
			}
		}
		stage ('Docker Image') {
			steps{
				script {
					bat 'docker build -t easy-contacts:V1.0 .'
				}
			}
			post {
				success {
					echo 'Docker Image is built successfully'
				}
				failure {
					echo 'Docker Image built failed'
				}
			}
		}
	}
	post {
    always {
      echo 'Build process initiated and'
    }
    success {
      echo 'build process completed successfully'
    }
    failure {
      echo 'build process failed'
    }
  }
}
