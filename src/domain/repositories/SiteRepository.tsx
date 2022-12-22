import SiteEntity from "../entities/SiteEntity";

export default interface SiteRepository {
    searchByWord: (word: string) => Promise<SiteEntity[]>;
}