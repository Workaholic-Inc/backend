pipeline {
  agent {
    node {
      label 'agent1'
    }

  }
  stages {
    stage('Checkout code') {
      steps {
        git(url: 'https://github.com/Workaholic-Inc/backend', branch: 'main')
      }
    }

    stage('Install Packages') {
      steps {
        sh 'yarn install'
      }
    }

    stage('Test') {
      steps {
        sh 'yarn run test'
      }
    }

    stage('Deploy') {
      steps {
        sh 'yarn run start'
      }
    }

  }
}