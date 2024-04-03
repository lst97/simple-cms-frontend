import { Button, Typography } from "@mui/material";

const Field = ({ name, type }: { title: string; description: string }) => {
  return (
    <div className="flex flex-col">
      <Typography variant="h6">{name}</Typography>
      <Typography variant="subtitle1">{type}</Typography>
    </div>
  );
};

const FieldsViewer = ({ fields }: { fields: string }) => {
  return (
    <div className="flex flex-col gap-2 m-8 rounded-md bg-white shadow-sm">
      <div className="flex flex-row justify-between">
        <Typography variant="h6">1 Fields</Typography>
        <div className="flex flex-row gap-2">
          <Button variant="contained" color="secondary">
            Configure the field
          </Button>
          <Button variant="contained" color="primary">
            + Add another field
          </Button>
        </div>
      </div>
      <div>
        {" "}
        {/* Loop the json */}
        {}
      </div>
    </div>
  );
};

const CollectionViewer = ({
  title,
  description,
  fields,
}: {
  title: string;
  description: string;
  fields: string;
}) => {
  return (
    <div className="flex flex-col m-8">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <Typography variant="h5">{title}</Typography>
          <Typography variant="subtitle1">{description}</Typography>
        </div>
        <div className="flex flex-row gap-2">
          <Button variant="contained" color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Save
          </Button>
        </div>
      </div>
      {FieldsViewer({ fields })}
    </div>
  );
};

export default CollectionViewer;
