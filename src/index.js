import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import '@atlaskit/css-reset';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

import initialData from './initial-data';

import Column from './Column';

const Container = styled.div`
  display: flex;
`;

class InnerList extends PureComponent {
  /*PureComponent takes care of shouldComponentUpdate with props
  Optimisation to avoid rendering the entire column when no change is done*/

  render() {
    const {column, taskMap, index, isDropDisabled} = this.props;
    const tasks = column.taskIds.map(taskId => taskMap[taskId]);
    return <Column column={column} tasks={tasks} index={index} isDropDisabled={isDropDisabled} />;
  }
}

class App extends Component {
  
  state = initialData;

  columnReordering = (source, destination, draggableId) => {
    const newColumnOrder = Array.from(this.state.columnOrder);
    newColumnOrder.splice(source.index, 1);
    newColumnOrder.splice(destination.index, 0, draggableId);
    const newState = {
      ...this.state,
      columnOrder: newColumnOrder,
    };
    this.setState(newState);
  }

  intraColumnReordering = (source, destination, draggableId, start) => {
    const newTaskIds = Array.from(start.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...start,
       taskIds: newTaskIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newColumn.id]: newColumn,
      }
    };
    this.setState(newState);
  }

  extraColumnReordering = (source, destination, draggableId, start, finish) => {
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      }
    };
    this.setState(newState);
  }

  onDragEnd = result => {
    this.setState({homeIndex: null});
    const {destination, source, draggableId, type} = result;
    if(!destination) {
      return;
    }
    if(destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if(type === 'column') {
      this.columnReordering(source, destination, draggableId);
      return;
    }
    //From here on, we deal we task drag & drop
    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];
    
    if(start === finish) {
      this.intraColumnReordering(source, destination, draggableId, start);
    } else {
      //Moving from one list to another
      this.extraColumnReordering(source, destination, draggableId, start, finish);
    }
  }

  onDragStart = start => {
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);
    this.setState({homeIndex});
  }

  /*onDragUpdate = update => {
    const {destination} = update;
    const opacity = destination ? destination.index / Object.keys(this.state.tasks).length : 0;
    document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity}`;
  }*/

  render() {
    return (
      <DragDropContext 
        onDragEnd={this.onDragEnd}
        onDragStart={this.onDragStart}
        /*onDragUpdate={this.onDragUpdate}*/>
          <Droppable
            droppableId="all-column"
            direction="horizontal"
            type="column">
              {provided => (
                <Container
                  {...provided.droppableProps}
                  innerRef={provided.innerRef}>
                    {this.state.columnOrder.map((columnId, index) => {
                      const column = this.state.columns[columnId];
                      const isDropDisabled = index < this.state.homeIndex;
                      return (
                        <InnerList
                          key={column.id}
                          column={column}
                          taskMap={this.state.tasks}
                          isDropDisabled={isDropDisabled}
                          index={index} />
                        );
                    })}
                    {provided.placeholder}
                </Container>
              )}
          </Droppable>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));