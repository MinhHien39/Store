class AppConstant {

    static ID_DEFAULT = -1;
    
    static USER_ID_DEFAULT = -1;


    static ROLE_ID_DEFAULT = -1;

    static STATUS_ID_DEFAULT = -1;

    static DOCUMENT_ID_DEFAULT = -1;

    static DROP_MAX_SIZE = 20 * 1024 * 1024; // 20MB

    static CURRENT_PAGE_DEFAULT = 1;

    static PER_PAGE_DEFAULT = 20;

    static ATTACH_IMAGES_DEFAULT = 1;

    static GET_ALL_USER_DEFAULT = 1;

    static DEFAULT_SELECT_ALL = -1;

    static PER_PAGE_999 = 999;

    static DROP_ACCEPT_TYPE = {
        'image/jpeg': ['.jpg', '.jpeg', '.png'],
        'image/gif': ['.gif'],
        'application/pdf': ['.pdf'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.ms-powerpoint': ['.ppt'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    }

    static DROP_ACCEPT_IMAGE = {
        'image/jpeg': ['.jpg', '.jpeg', '.png'],
    }

    static DROP_ACCEPT_MYSOKU = {
        'image/jpeg': ['.jpg', '.jpeg', '.png'],
        'image/gif': ['.gif'],
        'application/pdf': ['.pdf'],
    }
}

export default AppConstant;