// Level in format inspired by bulletML

const level0 = `
<document>
<action type='slow'>
  <wait type='time'>60</wait>
  <!-- Part 1 -->
  <!-- 3 + (2 per player) enemies -->
  <!-- Each spawns 3-5(same for all enemies) more 2 seconds after death. -->
  <action type='slow'>
    <objective>
      <title>#Reinforcements are coming#</title>
      <content>
        #After killing an enemy his friends\\n#
        #will seek ##0xff6961 revange## on you.#
      </content>
    </objective>
    <var type='set' name='children'>3 + _($rand * 2)</var>
    <repeat type='fast'>
      <times>3 + _($playerNum * 2)</times>
      <action type='slow'>
        <spawn>
          <enemy/>
        </spawn>
        <wait type='time'>120</wait>
        <repeat type='fast'>
          <times>$children</times>
          <action type='slow'>
            <spawn>
              <enemy/>
            </spawn>
          </action>
        </repeat>
      </action>
    </repeat>
  </action>
  <wait type='time'>60</wait>
  <!-- Part 2 -->
  <!-- Spawn (1 * players) enemy/second -->
  <!-- They die after 10-25 are killed -->
  <action type='slow'>
    <var type='set' name='killed'>0</var>
    <objective>
      <title>#Stop the flow#</title>
      <content>
        #There is a never-ending flow of enemies\\n#
        #that can only be stopped by killing (5 + (5 * $playersAlive)) of them\\n#
        #0xffb861 ($killed)# #/(5 + (5 * $playersAlive))#
      </content>
    </objective>
    <ctl>$killed &lt; 5 + (5 * $playersAlive)</ctl>
    <repeat type='slow'>
      <times>9999</times>
      <action type='fast'>
        <action type='slow'>
          <spawn>
            <enemy/>
          </spawn>
          <var type='add' name='killed'>1</var>
        </action>
        <wait type='time'>60 / $playerNum</wait>
      </action>
    </repeat>
  </action>
  <wait type='time'>120</wait>
  <!-- Part 3 -->
  <!-- Spawn 6 enemies/second -->
  <!-- They die after 8s~25s with ~16s being the most probable -->
  <action type='slow'>
    <objective>
      <title>#Hold out a bit#</title>
      <content>
        #There is a never-ending flow of enemies\\n#
        #that actually just ends after about ##0xff6961 15 seconds.\\n#
        #Just ##0xADD8E6 chill## a bit.#
      </content>
    </objective>
    <ttl>(500) + _($clt * 1000)</ttl>
    <repeat type='slow'>
      <times>9999</times>
      <action type='fast'>
        <spawn>
          <enemy/>
        </spawn>
        <wait type='time'>10</wait>
      </action>
    </repeat>
  </action>
  <wait type='time'>480</wait>
  <!-- Part 4 -->
  <!-- Spawn 15 + s, 14 + s, 13 + s, ..., 10 + s enemies -->
  <!-- They die after 6s-14s depending on number of players alive -->
  <!-- s is the number of Enemies that died due to the time limit and weren't killed by players -->
  <action type='slow'>
    <action type='slow'>
      <var type='set' name='wave'>15</var>
      <objective>
        <title>#Wave after wave...#</title>
        <content>
          #Enemies appear in waves and even ##0xff6961 disappear\\n#
          #after some time. But every surviving enemy\\n#
          #just comes back with the next wave.#
        </content>
      </objective>
      <repeat type='slow'>
        <times>5</times>
        <action type='slow'>
          <var type='set' name='survivors'>0</var>
          <repeat type='fast'>
            <ttl>1000 - $playersAlive * 150</ttl>
            <times>$wave + $survivors</times>
            <action type='slow'>
              <var type='add' name='survivors'>1</var>
              <spawn>
                <enemy/>
              </spawn>
              <var type='add' name='survivors'>-1</var>
            </action>
          </repeat>
          <wait type='time'>60</wait>
          <var type='add' name='wave'>0-1</var>
        </action>
      </repeat>
    </action>
    <action type='slow'>
      <objective>
        <title>#...wave after wave#</title>
        <content>
          #Clear the remaining ##0xff6961 ($survivors) enemies.#
        </content>
      </objective>
      <repeat type='fast'>
        <times>$survivors</times>
        <action type='slow'>
          <spawn>
            <enemy/>
          </spawn>
          <var type='add' name='survivors'>-1</var>
        </action>
       </repeat>
     </action>
  </action>
</action>
</document>`;
