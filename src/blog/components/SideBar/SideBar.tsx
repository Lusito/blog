import { withCss } from "../../utils/withCss";
import { SideBarHeader } from "../SideBarHeader/SideBarHeader";
import { SideBarMenu } from "../SideBarMenu/SideBarMenu";
import classes from "./SideBar.module.scss";

// eslint-disable-next-line func-names
export const SideBar = withCss(classes, () => (
    <>
        <div class={[classes.sideBar, "scatman-container"]}>
            <div class={[classes.content, "scatman-preserve-scroll"]} id="sidebar-scroll">
                <SideBarHeader />
                <SideBarMenu />
            </div>
            <div class={classes.trigger}>
                <div>
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        </div>
        <div class={classes.sideBarOverlay} />
    </>
));
