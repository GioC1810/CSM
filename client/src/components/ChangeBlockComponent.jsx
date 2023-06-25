import { Button, Row, Col } from "react-bootstrap";
import BlockComponent from "./BlockComponent";
import { Droppable, Draggable, DragDropContext } from "@hello-pangea/dnd";

const ChangeBlockComponent = ({
  contentList,
  setContentList,
  handleContentDelete,
  setContent,
  setType,
  setContentId,
  setShowContentForm,
  images
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
    reorderedStores.splice(storeDestinatonIndex, 0, removedStore);
    reorderedStores.forEach((el, index) => {
      el.position = index;
      return el;
    });
    return setContentList(reorderedStores);
  };

  const handleContentModify = (c) => {
    setShowContentForm(true);
    setType(c.type);
    setContent(c.content);
    setContentId(c.id);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable" type="content-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {contentList
              .sort((c1, c2) => c1.position - c2.position)
              .map((c, i) => (
                <Draggable key={c.id} draggableId={c.id.toString()} index={i}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Row className="mt-3">
                        <Col>
                          <BlockComponent content={c} images={images}/>
                        </Col>
                        <Col>
                          <Button
                            variant="danger"
                            onClick={() => handleContentDelete(i)}
                          >
                            Remove content
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            variant="primary"
                            onClick={() => handleContentModify(c)}
                          >
                            Modify content
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
