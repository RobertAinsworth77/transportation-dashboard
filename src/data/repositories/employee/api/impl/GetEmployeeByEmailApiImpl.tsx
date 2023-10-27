import EmployeeEntity from "../../../../../domain/entities/EmployeeEntity";
import EmployeeHostDto from "../../../../dto/employee/EmployeeHostDto";
import HostApi from "../../../../settings/host/HostApi";

const GetEmployeeByEmailApiImpl = async (email: string):Promise<EmployeeEntity | null > => {
    const relativeUrl = '/get_employee_info';
    const body = {
        email: email,
    };
    try {
        const response = await HostApi.post(relativeUrl, body);
        const parse = EmployeeHostDto.fromJson(response?.data?.[0]);
        return parse;
    } catch (error) {
        return null;
    }
}

export default GetEmployeeByEmailApiImpl;