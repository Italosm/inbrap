import { SegmentsDataBuilder } from '@/segments/domain/testing/helpers/segment-data-builder';
import {
  SegmentsRules,
  SegmentValidator,
  SegmentValidatorFactory,
} from '../../segments.validator';
import { SegmentsProps } from '@/segments/domain/entities/segment.entity';

let sut: SegmentValidator;
let props: SegmentsProps;

describe('SegmentsValidator unit tests', () => {
  beforeEach(() => {
    sut = SegmentValidatorFactory.create();
    props = SegmentsDataBuilder({});
  });

  it('Invalidation cases for segments field', () => {
    let isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(sut.errors['segment']).toStrictEqual([
      'segment should not be empty',
      'segment must be a string',
      'segment must be shorter than or equal to 255 characters',
    ]);

    isValid = sut.validate({ ...props, segment: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['segment']).toStrictEqual([
      'segment should not be empty',
    ]);

    isValid = sut.validate({ ...props, segment: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['segment']).toStrictEqual([
      'segment must be a string',
      'segment must be shorter than or equal to 255 characters',
    ]);

    isValid = sut.validate({ ...props, segment: 'a'.repeat(256) });
    expect(isValid).toBeFalsy();
    expect(sut.errors['segment']).toStrictEqual([
      'segment must be shorter than or equal to 255 characters',
    ]);
  });

  it('Invalidation cases for is_published field', () => {
    let isValid = sut.validate({ ...props, is_published: '' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['is_published']).toStrictEqual([
      'is_published must be a boolean value',
    ]);

    isValid = sut.validate({ ...props, is_published: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['is_published']).toStrictEqual([
      'is_published must be a boolean value',
    ]);

    isValid = sut.validate({ ...props, is_published: 'true' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['is_published']).toStrictEqual([
      'is_published must be a boolean value',
    ]);

    isValid = sut.validate({ ...props, is_published: 'false' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['is_published']).toStrictEqual([
      'is_published must be a boolean value',
    ]);
  });

  it('Invalidation cases for createdAt field', () => {
    let isValid = sut.validate({ ...props, createdAt: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ]);

    isValid = sut.validate({ ...props, createdAt: '2023' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ]);
  });

  it('Valid case for Segment rules', () => {
    let isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new SegmentsRules(props));

    isValid = sut.validate({ ...props, is_published: undefined });
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(
      new SegmentsRules({ ...props, is_published: undefined }),
    );

    isValid = sut.validate({ ...props, is_published: true });
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(
      new SegmentsRules({ ...props, is_published: true }),
    );

    isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(
      new SegmentsRules({ ...props, is_published: false }),
    );
  });
});
