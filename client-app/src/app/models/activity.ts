/**
 * interface IActivity  
 */
export interface IActivity {

    id: string;
    title: string;
    date: Date;
    description: string;
    category: string;
    city: string;
    venue: string;
}

export interface IActivityFormValues extends Partial<IActivity>{
    time?:Date
}
export class ActivityFormValues implements IActivityFormValues{
    
    id?: string=undefined;
    title: string='';
    date?: Date=undefined;
    time?: Date=undefined;
    description: string='';
    category: string='';
    city: string='';
    venue: string='';
    constructor(init?:IActivityFormValues){
        if(init && init.date){
            init.time=init.date;
        }
        Object.assign(this,init);
    }
}