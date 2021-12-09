import { Button, Card, CardActions, CardContent, CardMedia, Tooltip, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { deleteDesign } from "../../../../redux/create-abtest/createAbTestActions";
import { InitialDesign } from "../../../../redux/create-abtest/interfaces";
import { RdxActionPayload, RootState } from "../../../../redux/rootReducer";
import s from "./DesignCard.module.scss";
import CustomModal from "../../../reusable/CustomModal";
import DesignForm from "./subcomponents/DesignForm";
import { AdminState } from "../../../../redux/admin/interfaces";
import { createStructuredSelector } from "reselect";
import { selectTheme } from "../../../../redux/admin/adminSelectors";
import { darkModeCardBg, darkModeCardContent } from "../../../../helpers/constants";

type Props = InitialDesign & {
    idx: number,
    deleteDesign: (idx: number) => RdxActionPayload,
    disableButtons?: boolean,
    theme: AdminState["theme"]
}
const DesignCard = ({
    deleteDesign,
    image,
    name,
    comments,
    creator,
    score,
    theme,
    designText,
    idx,
    disableButtons
}: Props) => {
    const [open, setOpen] = React.useState(false);


    const DesignText = () => (
        designText && designText.length > 140 ? (
            <Tooltip title={designText}>
                <div className={s.designTextWrap}>
                    <div>
                        {designText}
                    </div>
                </div>
            </Tooltip>
        ) : (
            <div className={s.designTextWrap}>
                <div>
                    {designText}
                </div>
            </div>
        )
    );
    
    return (
        <Card className={s.wrap} key={idx} sx={theme === "dark" ? darkModeCardBg : {}}>
            {
                designText ? (
                        <CardMedia component={DesignText}/>
                ) : (
                    <CardMedia 
                        component="img" 
                        alt="design img"
                        image={image?.dataURL}
                        className={s.image}
                    />
                )
            }
            <div className={s.btmWrap}>
                <CardContent className={s.content} sx={theme === "dark" ? darkModeCardContent : {}}>
                    <div className={s.nameWrap}>
                        <Typography gutterBottom variant="body2" component="div">
                            {name}
                        </Typography>
                    </div>
                    <div className={s.commentsWrap}>
                        <Tooltip title={comments}>
                            <Typography variant="body2" color="text.secondary">
                                Comments: {comments}
                            </Typography>
                        </Tooltip>
                        
                    </div>
                    <div className={s.btm}>
                        <Typography variant="body2" color="text.secondary">
                            Created By: {creator}
                        </Typography>
                    </div>
                </CardContent>

                <CardActions className={theme === "dark" ? s.btnsDark : s.btns}>
                    <Button size="small" disabled={disableButtons} onClick={() => setOpen(true)}>Edit</Button>
                    <Button size="small" disabled={disableButtons} onClick={() => deleteDesign(idx)}>Delete</Button>
                </CardActions>
            </div>
            
            <CustomModal open={open} setOpen={setOpen}>
                <DesignForm idx={idx} setOpen={setOpen}/>
            </CustomModal>
        </Card>
    );
};

const mapDispatch = {
    deleteDesign: (idx: number) => deleteDesign(idx)
}

type SProps = Pick<Props, "theme">;
const mapStateToProps = createStructuredSelector<RootState, SProps>({
    theme: selectTheme
})

export default connect(mapStateToProps, mapDispatch)(DesignCard);