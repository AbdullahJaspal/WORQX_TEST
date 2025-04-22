import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


//addNotes
export interface AddNotesProps {
    navigation: NativeStackNavigationProp<any>;
}

//deleteNotes
export interface DeleteNotesProps {
    navigation: NativeStackNavigationProp<any>;
    route: {
        params: {
            checkedNoteIds: Array<string>;
        };
    };
}

//noteslist
export interface MyNotesProps {
    navigation: NativeStackNavigationProp<any>;
    route: any;
}

export interface Note {
    _id: number;
    content: string;
}


//viewnotes
export interface ViewNotesProps {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<{ params: { item: { _id: string; content: string } } }, 'params'>;
}