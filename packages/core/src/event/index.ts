import mitt, { Emitter } from "mitt";

type Events = {
    destroy: string[];
    refresh: string;
    destroyAll: void;
    destroyOther: string;
};

const eventBus: Emitter<Events> = mitt<Events>();

export default eventBus;
