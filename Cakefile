fs            = require 'fs'
{print}       = require 'sys'
{spawn, exec} = require 'child_process'

runCommand = (command, options) ->
  proc = spawn command, options
  proc.stdout.on 'data', (data) -> print data.toString()
  proc.stderr.on 'data', (data) -> print data.toString()
  proc.on 'exit', (status) -> callback?() if status is 0

build = (watch, callback) ->
  if typeof watch is 'function'
    callback = watch
    watch = false
  options = ['-c', '-o', 'lib', 'src']
  options.unshift '-w' if watch
  runCommand 'coffee', options
  options = ['-w', '-c', '-o', 'spec', 'test']
  runCommand 'coffee', options

task 'watch', 'Recompile CoffeeScript source files when modified', ->
  build true

task 'temp', 'Prototyping not so well known functions, apis etc.', ->
  options = ['lib/temp.js']
  runCommand 'node', options

task 'test', 'Test features using jasmine-node', ->
  options = ['spec']
  runCommand 'jasmine-node', options

task 'run', 'Run the web application using node-supervisor', ->
  options = ['-w', 'lib', '-p', 'lib/controllers/web.js']
  runCommand 'supervisor', options
