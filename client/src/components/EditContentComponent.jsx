import { Container, Button, Form } from "react-bootstrap";
import ImageSelectorComponent from "./ImageSelectorComponent";
import ChangeBlockComponent from "./ChangeBlockComponent";

const EditContentComponent = ({
  setErrMsg,
  contents,
  setContentList,
  content,
  setContent,
  type,
  setType,
  contentId,
  setContentId,
  lastId,
  showContentForm,
  setShowContentForm,
  handleContentDelete
}) => {
  const blockTypes = ["header", "image", "paragraph"];

  const handleContentSubmit = (e) => {
    e.preventDefault();
    if (!content) {
      setErrMsg("The content cannot be empty!");
      return;
    }
    const contentExist = contents.find((c) => c.id === contentId);
    if (contentExist) {
      setContentList[
        contents.map((c) => {
          if (c.id === contentId) {
            c.content = content;
            c.type = type;
          }
          return c;
        })
      ];
    } else {
      setContentList([
        ...contents,
        { type: type, content: content, position: contents.length, id: lastId },
      ]);
    }
    setContentId(-1);
    setType("header");
    setContent("");
  };

  return (
    <Container>
      {showContentForm && (
        <Form.Group className="mb-2" controlId="content-type">
          <Form.Label>Type of content</Form.Label>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
            {blockTypes.map((t) => {
              return (
                <option key={t} value={t}>
                  {t}
                </option>
              );
            })}
          </Form.Select>
          {type === "image" ? (
            <ImageSelectorComponent setContent={setContent} />
          ) : (
            <>
              <Form.Label>Content</Form.Label>
              <Form.Control
                size="md"
                as="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></Form.Control>
            </>
          )}
          <Button
            style={{ background: "#004170" }}
            onClick={handleContentSubmit}
          >
            {contentId === -1 ? "Add content" : "Modify content"}
          </Button>
        </Form.Group>
      )}
      <ChangeBlockComponent
        contentList={contents}
        setContentList={setContentList}
        setContent={setContent}
        setType={setType}
        setContentId={setContentId}
        handleContentDelete={handleContentDelete}
        setShowContentForm={setShowContentForm}
      />
    </Container>
  );
};

export default EditContentComponent;
