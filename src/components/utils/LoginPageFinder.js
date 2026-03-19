import { useAuth } from "../../context/AuthContext";

function LoginPageFinder(fieldName, fieldValue) {
    const { adminUser } = useAuth();
    const loginPage = adminUser?.loginGroupNames || [];

    const results = [];

    if (!loginPage || !Array.isArray(loginPage)) {
        return results;
    }

    loginPage.forEach(group => {
        if (group.loginpageNames && Array.isArray(group.loginpageNames)) {
            group.loginpageNames.forEach(page => {
                let match = false;

                switch (fieldName) {
                    case 'page_id':
                        match = page.page_id === fieldValue;
                        break;
                    case 'page_url':
                        match = page.page_url === fieldValue;
                        break;
                    case 'page_display_name':
                        match = page.page_display_name === fieldValue;
                        break;
                    case 'group_id':
                        match = group.group_id === fieldValue;
                        break;
                    case 'group_display_name':
                        match = group.group_display_name === fieldValue;
                        break;
                    case 'read_write_permission':
                        // Handle boolean comparison - can accept both boolean and string values
                        if (typeof fieldValue === 'boolean') {
                            match = page.read_write_permission === fieldValue;
                        } else if (typeof fieldValue === 'string') {
                            // Convert string to boolean for comparison
                            const boolValue = fieldValue.toLowerCase() === 'true';
                            match = page.read_write_permission === boolValue;
                        }
                        break;
                    default:
                        match = false;
                }

                if (match) {
                    results.push({
                        group_id: group.group_id,
                        group_display_name: group.group_display_name,
                        page_id: page.page_id,
                        page_display_name: page.page_display_name,
                        page_url: page.page_url,
                        read_permission_access: page.read_permission_access,
                        read_write_permission: page.read_write_permission
                    });
                }
            });
        }
    });

    return results;
}

export default LoginPageFinder;