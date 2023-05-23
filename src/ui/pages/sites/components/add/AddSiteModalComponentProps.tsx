import SiteEntity from "../../../../../domain/entities/SiteEntity";

interface AddSiteModalComponentProps {
    site?: SiteEntity | undefined;
    done: ()=>void;
}

export default AddSiteModalComponentProps;
