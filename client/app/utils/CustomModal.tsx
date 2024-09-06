import React, { FC } from "react";
import {Modal} from "@mui/material";
import {Box} from "@mui/material";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: any;
    component: any;
    setRoute: (route: string) => void;
};

const CustomModal: FC<Props> = ({
    open,
    setOpen,
    activeItem,
    component: Component,
    setRoute,
}) => {
    return (
        <Modal
            open={open} 
            area-labelledby="modal-modal-title"
            area-describedby="modal-modal-description"
        >
            <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 800px:w-[450px] w-[90%] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <Component setOpen={setOpen} setRoute={setRoute} />
            </Box>
        </Modal>
    )
};

export default CustomModal;
