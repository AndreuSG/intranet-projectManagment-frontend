// core/services/rubrics.service.ts
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { RubricGroup } from '../../models/interfaces/rubricGroup.interface';
import { API_URLS } from '../../shared/api-routes.const';
import { Rubric } from '../../models/interfaces/rubric.interface';
import { RubricCriterion } from '../../models/interfaces/rubricCriterion.interface';
import { RubricLevel } from '../../models/interfaces/rubricLevel.interface';

@Injectable({
    providedIn: 'root'
})
export class RubricsService extends ApiService {

    findAllGroups(): Observable<RubricGroup[]> {
        return this.get(API_URLS.RUBRICS.COURSES).pipe(map((res) => res as RubricGroup[]));
    }

    createGroup(dto: { name: string; description?: string }): Observable<RubricGroup> {
        return this.post(API_URLS.RUBRICS.COURSES, dto).pipe(map((res) => res as RubricGroup));
    }

    findRubricsByGroup(groupId: number): Observable<Rubric[]> {
        return this.get(`${API_URLS.RUBRICS.BASE}?grupId=${groupId}`);
    }

    createRubric(rubric: Rubric): Observable<Rubric> {
        return this.post(API_URLS.RUBRICS.BASE, rubric);
    }

    deleteRubric(id: number): Observable<void> {
        return this.del(`${API_URLS.RUBRICS.BASE}/${id}`);
    }

    /* ---------- CRITERIOS ---------- */

    // GET rubric-criterion?rubricaId=xxx
    getCriteria(rubricId: number) {
        return this.get(
            `${API_URLS.RUBRICS.RUBRIC_CRITERION}?rubricaId=${rubricId}`
        );
    }

    createCriterion(dto: Omit<RubricCriterion, 'id'>) {
        return this.post(
            API_URLS.RUBRICS.RUBRIC_CRITERION,
            dto
        );
    }

    deleteCriterion(id: number): Observable<void> {
        return this.del(`${API_URLS.RUBRICS.RUBRIC_CRITERION}/${id}`);
    }

    /* ---------- NIVELES ---------- */

    getLevels(criteriId: number): Observable<RubricLevel[]> {
        return this.get(`${API_URLS.RUBRICS.RUBRIC_LEVEL}/criteri/${criteriId}`).pipe(map(res => res as RubricLevel[]));
    }

    createLevel(dto: Omit<RubricLevel, 'id' | 'criteriId'>): Observable<RubricLevel> {
        return this.post(API_URLS.RUBRICS.RUBRIC_LEVEL, dto).pipe(map(res => res as RubricLevel));
    }

    updateLevel(id: number, dto: Partial<RubricLevel>): Observable<RubricLevel> {
        return this.put(`${API_URLS.RUBRICS.RUBRIC_LEVEL}/${id}`, dto).pipe(map(res => res as RubricLevel));
    }

    deleteLevel(id: number): Observable<void> {
        return this.del(`${API_URLS.RUBRICS.RUBRIC_LEVEL}/${id}`);
    }
}
