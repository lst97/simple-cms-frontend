import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { SupportedAttributeTypes, SupportedAttributes } from "../../../models/share/collection/CollectionBaseSchema";

function AttributeTypesGrid({
  onClick,
}: {
  onClick: (type: SupportedAttributeTypes) => void;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Grid container spacing={2} sx={{ margin: 2 }}>
        <Grid xs={6}>
          <Button
            variant="outlined"
            sx={{ width: "100%", display: "flex", gap: 2 }}
            onClick={() => onClick(SupportedAttributes.text)}
          >
            <Typography variant="body1">Text</Typography>
            <Typography variant="subtitle2" sx={{ color: "gray" }}>
              Short or long text like title or description
            </Typography>
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            variant="outlined"
            sx={{ width: "100%", display: "flex", gap: 2 }}
          >
            <Typography variant="body1">Reach Text</Typography>
            <Typography variant="subtitle2" sx={{ color: "gray" }}>
              Long text with reach formatting like blog post
            </Typography>
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            variant="outlined"
            sx={{ width: "100%", display: "flex", gap: 2 }}
          >
            <Typography variant="body1">Code</Typography>
            <Typography variant="subtitle2" sx={{ color: "gray" }}>
              Code snippet with syntax highlighting
            </Typography>
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            variant="outlined"
            sx={{ width: "100%", display: "flex", gap: 2 }}
          >
            <Typography variant="body1">Media</Typography>
            <Typography variant="subtitle2" sx={{ color: "gray" }}>
              Image, audio, video
            </Typography>
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            variant="outlined"
            sx={{ width: "100%", display: "flex", gap: 2 }}
          >
            <Typography variant="body1">Document</Typography>
            <Typography variant="subtitle2" sx={{ color: "gray" }}>
              PDF, Word, Excel, or PowerPoint
            </Typography>
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            variant="outlined"
            sx={{ width: "100%", display: "flex", gap: 2 }}
          >
            <Typography variant="body1">Date</Typography>
            <Typography variant="subtitle2" sx={{ color: "gray" }}>
              Date or date-time
            </Typography>
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            variant="outlined"
            sx={{ width: "100%", display: "flex", gap: 2 }}
          >
            <Typography variant="body1">Number</Typography>
            <Typography variant="subtitle2" sx={{ color: "gray" }}>
              Integer number
            </Typography>
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            variant="outlined"
            sx={{ width: "100%", display: "flex", gap: 2 }}
          >
            <Typography variant="body1">Decimal</Typography>
            <Typography variant="subtitle2" sx={{ color: "gray" }}>
              Decimal number
            </Typography>
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            variant="outlined"
            sx={{ width: "100%", display: "flex", gap: 2 }}
          >
            <Typography variant="body1">Boolean</Typography>
            <Typography variant="subtitle2" sx={{ color: "gray" }}>
              True or false
            </Typography>
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ margin: 2 }}>
        <Grid xs={6}>
          <Button
            variant="outlined"
            sx={{ width: "100%", display: "flex", gap: 2 }}
          >
            <Typography variant="body1">Dynamic</Typography>
            <Typography variant="subtitle2" sx={{ color: "gray" }}>
              Dynamic content
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AttributeTypesGrid;
