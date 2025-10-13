import RouteAlignmentEntity from "../../domain/entities/RouteAlignmentEntity";
import RouteAlignmentRepository from "../../domain/repositories/RouteAlignmentRepository";
import { OrdeByFilterEntity } from "../../domain/entities/OrdeByFilterEntity";
import RouteAlignmentDto from "../dto/RouteAlignmentDto";

const API_URL = "https://9wieil5vn5.execute-api.us-east-1.amazonaws.com/dev";

export default class RouteAlignmentRepositoryImpl implements RouteAlignmentRepository {
  
  async getFiltredRouteAlignments(
    searchWord: string,
    page: number,
    itemsPerPage: number,
    orderBy?: OrdeByFilterEntity
  ): Promise<{
    routeAlignments: RouteAlignmentEntity[];
    current_page: number;
    total_pages: number;
    total_rows: number;
    orderBy?: OrdeByFilterEntity;
  }> {
    try {
      const params = new URLSearchParams({
        search_word: searchWord,
        page: page.toString(),
        items_per_page: itemsPerPage.toString(),
      });

      if (orderBy) {
        params.append('order_by_key_name', orderBy.keyName);
        params.append('order_by_is_desc', orderBy.isDesc.toString());
      }

      const response = await fetch(`${API_URL}/dashboard/route-alignments?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('aws_cognito_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch route alignments');
      }

      const data = await response.json();
      
      return {
        routeAlignments: data.route_alignments?.map((dto: any) => new RouteAlignmentDto(
          dto.id,
          dto.country,
          dto.city,
          dto.community,
          dto.created_date,
          dto.is_active
        ).toEntity()) || [],
        current_page: data.current_page || 1,
        total_pages: data.total_pages || 1,
        total_rows: data.total_rows || 0,
        orderBy: data.orderBy,
      };
    } catch (error) {
      throw error;
    }
  }

  async createRouteAlignment(routeAlignment: RouteAlignmentEntity): Promise<void> {
    try {
      const dto = RouteAlignmentDto.fromEntity(routeAlignment);
      
      const response = await fetch(`${API_URL}/dashboard/route-alignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('aws_cognito_token')}`,
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        throw new Error('Failed to create route alignment');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateRouteAlignment(routeAlignment: RouteAlignmentEntity): Promise<void> {
    try {
      const dto = RouteAlignmentDto.fromEntity(routeAlignment);
      
      const response = await fetch(`${API_URL}/dashboard/route-alignments/${routeAlignment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('aws_cognito_token')}`,
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        throw new Error('Failed to update route alignment');
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteRouteAlignment(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/dashboard/route-alignments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('aws_cognito_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete route alignment');
      }
    } catch (error) {
      throw error;
    }
  }
}
