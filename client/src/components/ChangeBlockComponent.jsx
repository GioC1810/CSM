import { Container, Button, Row, Col, Form, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ImageSelectorComponent from "./ImageSelectorComponent";
import BlockComponent from "./BlockComponent";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import API from "../API";

const ChangeBlockComponent = ({
  contentList,
  setContentList,
  handleContentDelete,
}) => {
  const handleDragEnd = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    
     const reorderedStores = [...contentList];
     const storeSourceIndex = source.index;
     const storeDestinatonIndex = destination.index;
     const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
     reorderedStores.splice(storeDestinatonIndex, 0,removedStore);
     reorderedStores.forEach((el, index) => {
        el.position = index;
        return el;
     })
     return setContentList(reorderedStores);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable" type="content-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {contentList.sort((c1, c2) => c1.position - c2.position).map((c, i) => (
              <Draggable key={c.id} draggableId={c.id.toString()} index={i}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Row className="mt-3">
                      <Col>
                        <BlockComponent content={c} />
                      </Col>
                      <Col>
                        <Button
                          variant="danger"
                          onClick={() => handleContentDelete(i)}
                        >
                          Remove content
                        </Button>
                      </Col>
                    </Row>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChangeBlockComponent;
