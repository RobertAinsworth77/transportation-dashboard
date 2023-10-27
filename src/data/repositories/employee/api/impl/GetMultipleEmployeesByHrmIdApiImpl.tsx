import EmployeeEntity from "../../../../../domain/entities/EmployeeEntity";
import EmployeeHostDto from "../../../../dto/employee/EmployeeHostDto";
import HostApi from "../../../../settings/host/HostApi";

const GetMultipleEmployeesByHrmIdApiImpl = async (hrms: string[]): Promise<EmployeeEntity[] | null> => {
    const relativeUrl = '/employee/search/multiple_by_hrm';
    const body = {
        hrms_ids: hrms.join(','),
    };
    try {
        const response = await HostApi.post(relativeUrl, body);
        const parse = response?.data?.map((employeeJson: any) => EmployeeHostDto.fromJson(employeeJson));
        return parse;
    } catch (error) {
        return null;
    }
}

export default GetMultipleEmployeesByHrmIdApiImpl;