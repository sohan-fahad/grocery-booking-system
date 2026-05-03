export interface EventResponseOption {
    payload: object;
    type: string;
}

export class EventResponse {
    public payload: object;
    public type: string;

    constructor(option: EventResponseOption) {
        this.type = option.type;
        this.payload = option.payload;
    }
}