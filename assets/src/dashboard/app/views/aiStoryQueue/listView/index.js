/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../../components';

const FIELDS = {
  id: 'id',
  url: 'article url',
  status: 'status',
};

const StyledListView = styled.div`
  width: 100%;
`;

const TableRowHeader = styled(TableRow)`
  background-color: #ccc;
`;

const StyledTableRow = styled(TableRow)`
  :nth-child(even) {
    background-color: #f0f0f0f0;
  }
`;

function ListView({ queues }) {
  return (
    <StyledListView>
      <Table>
        <TableHeader>
          <TableRowHeader>
            {Object.keys(FIELDS).map((key) => (
              <TableCell key={`queue-${key}`}>{FIELDS[key]}</TableCell>
            ))}
          </TableRowHeader>
        </TableHeader>
        <TableBody>
          {queues.map((queue, index) => (
            <StyledTableRow key={`queue-${index}`}>
              {Object.keys(FIELDS).map((key) => (
                <TableCell key={`stor-${index}-${key}`}>{queue[key]}</TableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledListView>
  );
}

ListView.propTypes = {
  queues: PropTypes.array.isRequired,
};

export default ListView;
