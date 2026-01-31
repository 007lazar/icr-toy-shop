import { ToyModel } from '../models/toy.model';
import { ToyService } from './toy.service';

// Mock uuid
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));

describe('ToyService.getAverageRating', () => {

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('returns 0 when there are no reviews', () => {
        jest.spyOn(ToyService, 'getReviews').mockReturnValue([]);

        const result = ToyService.getAverageRating(1);

        expect(result).toBe(0);
    });

    it('returns rounded average rating', () => {
        jest.spyOn(ToyService, 'getReviews').mockReturnValue([
            { id: '1', user: 'John', comment: 'Great!', rating: 2, date: '2025-01-31' },
            { id: '2', user: 'Jane', comment: 'Good', rating: 3, date: '2025-01-30' },
            { id: '3', user: 'Bob', comment: 'Nice', rating: 2, date: '2025-01-29' }
        ]);

        const result = ToyService.getAverageRating(1);

        expect(result).toBe(2.3);
    });
});

describe("ToyService.getReviews", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('returns empty array if no review exist', () => {
        const reviews = ToyService.getReviews(1);
        expect(reviews).toEqual([]);
    })

    it('returns reviews for a toyId from localStorage', () => {
        const mockReview: Exclude<ToyModel['reviews'], undefined>[0] = {
            id: 'fixed-id',
            user: 'Lazar',
            comment: 'Nice toy',
            rating: 5,
            date: '2025-01-31'
        };
        localStorage.setItem('toy_reviews', JSON.stringify({ 1: [mockReview] }));

        const reviews = ToyService.getReviews(1);

        expect(reviews).toHaveLength(1)
        expect(reviews![0]).toMatchObject(mockReview)

    })
});