name: "CodeQL Analysiss"

on:
push:
branches: [ main, staging ]
pull_request:
branches: [ main, staging ]

jobs:
analyze:
name: Analyze code with CodeQL
runs-on: ubuntu-latest
permissions:
contents: read
actions: read
security-events: write

    strategy:
      matrix:
        language: [ 'javascript', 'typescript' ]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}

      - name: Autobuild
        uses: github/codeql-action/autobuild@v2

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2