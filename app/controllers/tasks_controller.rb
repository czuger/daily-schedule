class TasksController < ApplicationController
  def show
  end

  def create
    File.open( 'data/tasks.json', 'w' ) do |f|
      f.write( params[ :data ].to_json )
    end
  end
end
